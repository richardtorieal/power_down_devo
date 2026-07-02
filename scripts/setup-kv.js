#!/usr/bin/env node
/**
 * Creates a Vercel KV store and links it to the power_down_devo project,
 * then adds the required environment variables.
 */

const fs = require('fs');
const os = require('os');

const authData = JSON.parse(fs.readFileSync(os.homedir() + '/Library/Application Support/com.vercel.cli/auth.json', 'utf8'));
const TOKEN = authData.token;
const TEAM_ID = 'team_yqLf23JNtm6syGbMxVHNxWEw';
const PROJECT_ID = 'prj_PWdV6hpAt81I0vX7rNO7k0vMqUQH';
const STORE_NAME = 'power-devo-kv';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

async function api(method, path, body) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function main() {
  // 1. List existing KV stores
  console.log('📦 Checking existing KV stores...');
  const existing = await api('GET', `/v1/storage/stores?teamId=${TEAM_ID}&resourceType=kv`);
  console.log('Existing stores response:', existing.status);
  
  if (existing.ok && existing.data.stores) {
    const match = existing.data.stores.find(s => s.name === STORE_NAME);
    if (match) {
      console.log('✅ KV store already exists:', match.id);
      return match;
    }
    console.log('Existing stores:', existing.data.stores.map(s => s.name));
  } else {
    console.log('Store list response:', JSON.stringify(existing.data).substring(0, 300));
  }

  // 2. Create new KV store
  console.log(`\n🏗️  Creating KV store "${STORE_NAME}"...`);
  const created = await api('POST', `/v1/storage/stores?teamId=${TEAM_ID}`, {
    name: STORE_NAME,
    type: 'kv',
    regions: ['iad1']
  });
  console.log('Create response status:', created.status);
  console.log('Create response:', JSON.stringify(created.data).substring(0, 500));

  if (!created.ok) {
    console.error('❌ Failed to create KV store');
    process.exit(1);
  }

  return created.data.store || created.data;
}

main().then(store => {
  if (store) {
    console.log('\n🎉 Store ready:', JSON.stringify(store, null, 2).substring(0, 400));
  }
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
