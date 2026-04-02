const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

async function enforceRLS() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.SUPABASE_DB_URL;

  if (!supabaseUrl || !serviceKey || !dbUrl) {
    console.error('❌ Faltan credenciales en el archivo de entorno (.env.admin).');
    process.exit(1);
  }

  // 1. Conectarse a Supabase usando SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Conexión Directa DDL para manipulación de Políticas y Funciones
  const pgClient = new Client({ connectionString: dbUrl });

  try {
    await pgClient.connect();
    console.log('✅ Conexión establecida a PostgreSQL.');

    // 2. Inyectar Función Maestra de Seguridad (is_admin)
    console.log('\n🛠️ Inyectando función de validación de perfiles (is_admin)...');
    await pgClient.query(`
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS boolean AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✔️ Función is_admin() creada con éxito.');


    // 3. Listar todas las tablas en el esquema 'public'
    const listTablesQuery = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `;
    const tablesRes = await pgClient.query(listTablesQuery);
    
    // Ignorar tablas logísticas o vistas si las hubiera, aunque pg_tables ya filtra bien.
    const tables = tablesRes.rows.map(r => r.tablename);
    console.log(`\n🔍 Tablas detectadas (${tables.length}):`, tables.join(', '));

    // 4. Proceso de inyección RLS por tabla
    for (const table of tables) {
      console.log(`\n--- Analizando tabla: [${table}] ---`);

      // La tabla `profiles` es especial. No queremos pisar el RLS nativo de Auth si ya funcionaba bien para auto-registro.
      // Sin embargo, podemos aplicarle las políticas si no tenía. Pero por precaución dejaremos que se le apliquen las de LECTURA GENERAL e is_admin.
      
      const checkRlsQuery = `
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE oid = 'public.${table}'::regclass;
      `;
      const rlsRes = await pgClient.query(checkRlsQuery);
      const isRlsEnabled = rlsRes.rows[0]?.relrowsecurity;

      if (!isRlsEnabled) {
        console.log(`⚠️ RLS desactivado en [${table}]. Activando...`);
        await pgClient.query(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;`);
        console.log(`✔️ RLS activado con éxito.`);
      } else {
        console.log(`✔️ RLS ya activado en [${table}].`);
      }

      // Limpiar políticas anteriores (Adaptado)
      await pgClient.query(`DROP POLICY IF EXISTS "Permitir escrituras a admin" ON "public"."${table}";`);
      await pgClient.query(`DROP POLICY IF EXISTS "Permitir lectura publica" ON "public"."${table}";`);

      // Crear política de LECTURA PÚBLICA (SELECT)
      console.log(`🛡️ Creando política de LECTURA PÚBLICA para [${table}]...`);
      await pgClient.query(`
        CREATE POLICY "Permitir lectura publica" ON "public"."${table}"
        FOR SELECT
        USING (true);
      `);

      // Crear política de ESCRITURA ESTRICTA referenciando la función maestra
      console.log(`🛡️ Creando política de ESCRITURA para Administradores Reales en [${table}]...`);
      await pgClient.query(`
        CREATE POLICY "Permitir escrituras a admin" ON "public"."${table}"
        FOR ALL
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
      `);

      console.log(`✅ Políticas dinámicas aseguradas para [${table}].`);
    }

    console.log('\n======================================================');
    console.log('✅ AUDITORÍA Y FORTALECIMIENTO DE RLS COMPLETADO');
    console.log('======================================================');

  } catch (error) {
    console.error('\n❌ Error crítico durante la ejecución:', error.message);
  } finally {
    await pgClient.end();
  }
}

enforceRLS();
