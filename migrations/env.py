from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Importa as configurações e modelos da tua aplicação
from app.database.connection import Base
from app.models import user  # importa para registrar o modelo User
from app.core.config import settings

# Alembic Config object
config = context.config

# Interpreta o arquivo alembic.ini (logging)
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Adiciona a URL do banco de dados a partir do settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Usa os metadados da tua base de dados (Base do SQLAlchemy)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Executa as migrações no modo offline."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Executa as migrações no modo online."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
