# syntax=docker/dockerfile:1
FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive
ARG DB_USER
ARG DB_PASSWORD

RUN apt-get update && apt-get install -y postgresql-12 postgresql-client-12 curl python3 sudo

USER postgres

RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER ${DB_USER} WITH SUPERUSER PASSWORD '${DB_PASSWORD}';"

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/12/main/pg_hba.conf

# And add ``listen_addresses`` to ``/etc/postgresql/9.3/main/postgresql.conf``
RUN echo "listen_addresses='*'" >> /etc/postgresql/12/main/postgresql.conf

# Expose the PostgreSQL port
EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

COPY migration.py migration.sh migrated_data.sql ./

USER root

ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD

# Set the default command to run when starting the container
CMD "./migration.sh"