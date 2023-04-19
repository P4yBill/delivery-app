FROM mongo

COPY users.json /users.json
COPY categories.json /categories.json
COPY items.json /items.json

COPY start.sh /start.sh

RUN chmod +x /start.sh
CMD ["/start.sh"]