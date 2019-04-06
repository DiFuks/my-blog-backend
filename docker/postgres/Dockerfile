FROM postgres:11.1

RUN apt update \
    && apt install -y postgresql-11-cron

COPY ./docker-entrypoint-init.d/001-init-user-db.sh /docker-entrypoint-initdb.d/001-init-user-db.sh
RUN chmod +x /docker-entrypoint-initdb.d/001-init-user-db.sh

# Copy postgres config file into container
COPY ./config/postgresql.conf /etc/postgresql

# Override default postgres config file
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
