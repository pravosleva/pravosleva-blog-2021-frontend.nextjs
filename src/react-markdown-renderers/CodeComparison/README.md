# v2
## Var A
Простой (Обычным текстом, если код короткий и без спецсимволов маркдауна)
```tsx
<CodeComparison 
  hideInputs={true}
  oldCodeRaw="const port = 3000;
server.listen(port);"
  newCodeRaw="const PORT = process.env.PORT || 3000;
server.listen(PORT);"
/>
```

## Var B
Если код большой, содержит много кавычек, обратных слэшей или JSX-тегов, маркдаун-парсер может запутаться и сломать гидратацию. Чтобы этого не произошло, переведите строки кода в Base64 (например, в консоли браузера через `btoa()`) и вставьте их так:
```tsx
<CodeComparison 
  hideInputs={true} 
  oldCodeBase64="Y29uc3QgYSA9IDEwOwpjb25zb2xlLmxvZyhhKTs=" 
  newCodeBase64="Y29uc3QgYSA9IDIwOwpjb25zb2xlLmxvZyhhKTs=" 
/>
```
