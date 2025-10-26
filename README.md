# Real-time-Phishing-Prevention

リアルタイムフィッシング対策の概念実証

## 概念

クライアント側でドメインを認証情報に組み込んだらリアルタイムフィッシング対策になるきがした

## テスト方法

### 通常ログインサイト

```bash
PORT=3000 node index.mjs
```

### ログインできないサイト

```bash
PORT=3001 node index.mjs
```

### ログイン情報

- ID: test
- PW: password
