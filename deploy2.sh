# NOTE: Way 1

deploy_path_build_dir=root@pravosleva.ru:/home/projects/pravosleva-blog/frontend.nextjs/.next
deploy_path_public_dir=root@pravosleva.ru:/home/projects/pravosleva-blog/frontend.nextjs/public

echo '-- DEPLOY STARTED' &&

rsync -av --delete .next/ $deploy_path_build_dir &&
rsync -av --delete public/ $deploy_path_public_dir &&

# NOTE: Way 2
# rsync -a ./.next ./public root@pravosleva.ru:/home/projects/pravosleva-blog/frontend.nextjs/.next

# NOTE: Way 3 (See also)
# https://kylemacquarrie.co.uk/blog/simple-deploys-with-npm-and-rsync

echo '-- DEPLOY COMPLETED'