<script setup lang="ts">
import HomeLink from '@/components/homePage/HomeLink.vue'
</script>

<template>
  <section class="p-6 md:p-0 lg:w-2/3 xl:w-1/2">
    <div class="flex flex-col gap-4 md:gap-8">
      <h3 class="text-3xl font-semibold">How it works</h3>
      <p class="text-lg leading-8 text-muted-foreground">
        SqlZen runs full instances of
        <HomeLink href="https://www.postgresql.org/">PostgreSQL</HomeLink>,
        <HomeLink href="https://sqlite.org/">SQLite</HomeLink>
        and <HomeLink href="https://duckdb.org/">DuckDB</HomeLink> locally on
        your machine using WebAssembly. This wouldn't be possible without the
        amazing work done by the developers of
        <HomeLink href="https://pglite.dev/">PGlite</HomeLink>,
        <HomeLink href="https://sqlite.org/wasm">sqlite-wasm</HomeLink>, and
        <HomeLink href="https://duckdb.org/docs/api/wasm/overview"
          >DuckDB Wasm</HomeLink
        >.
      </p>
      <p class="text-lg leading-8 text-muted-foreground">
        To provide a feature rich editing experience, SqlZen uses
        <HomeLink href="https://microsoft.github.io/monaco-editor/"
          >Monaco</HomeLink
        >, the same technology that powers VSCode.
      </p>
    </div>
  </section>
</template>
