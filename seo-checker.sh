#!/bin/bash

echo "=== 🧐 STARTING SEO CHECK ==="

echo -e "\n1. Checking Robots.txt on PRODUCTION (.pro):"
curl -s https://pravosleva.pro | grep -E "User-agent|Disallow|Allow|Sitemap"

echo -e "\n2. Checking Robots.txt on STAGE (.ru):"
curl -s https://pravosleva.ru | grep -E "User-agent|Disallow|Allow|Sitemap"

echo -e "\n3. Checking if Sitemap exists on PRODUCTION:"
PRO_STATUS=$(curl -o /dev/null -s -w "%{http_code}" https://pravosleva.pro)
echo "Status code for pravosleva.pro/sitemap.xml: $PRO_STATUS"

echo -e "\n4. Checking if Sitemap exists on STAGE:"
RU_STATUS=$(curl -o /dev/null -s -w "%{http_code}" https://pravosleva.ru)
echo "Status code for pravosleva.ru/sitemap.xml: $RU_STATUS"

echo -e "\n=== 🎉 SEO CHECK COMPLETED ==="
