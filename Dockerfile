FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY src/ /usr/share/nginx/html/
COPY entrypoint.sh /usr/share/nginx/entrypoint.sh

RUN chmod +x /usr/share/nginx/entrypoint.sh

EXPOSE 80

CMD ["/usr/share/nginx/entrypoint.sh"]