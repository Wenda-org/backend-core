"""add password_hash to users

Revision ID: 123e3ff55d91
Revises: 
Create Date: 2025-10-26 20:05:00.820217
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '123e3ff55d91'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Cria nova coluna UUID temporária
    op.add_column('users', sa.Column('uuid_tmp', sa.dialects.postgresql.UUID(as_uuid=True), nullable=True))

    # Gera UUIDs para todas as linhas existentes
    op.execute("UPDATE users SET uuid_tmp = gen_random_uuid();")

    # Remove constraints e índices que dependem de id
    op.drop_index(op.f('ix_users_email'), table_name='users', if_exists=True)
    op.drop_index(op.f('ix_users_id'), table_name='users', if_exists=True)

    # Remove coluna antiga e renomeia nova
    op.drop_column('users', 'id')
    op.alter_column('users', 'uuid_tmp', new_column_name='id', existing_type=sa.dialects.postgresql.UUID(as_uuid=True))

    # Define a nova coluna como PRIMARY KEY
    op.execute("ALTER TABLE users ADD PRIMARY KEY (id);")

    # Adiciona as novas colunas
    op.add_column('users', sa.Column('password_hash', sa.String(length=255), nullable=False))
    op.add_column('users', sa.Column('role', sa.Enum('admin', 'editor', 'viewer', name='userrole'), nullable=True))
    op.add_column('users', sa.Column('status', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=True))

    # Garante que email seja único e obrigatório
    op.alter_column('users', 'email', existing_type=sa.VARCHAR(), nullable=False)
    op.create_unique_constraint(None, 'users', ['email'])



def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(None, 'users', type_='unique')
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.alter_column('users', 'email',
                    existing_type=sa.VARCHAR(),
                    nullable=True)

    # Reverte tipo da coluna id
    op.execute('ALTER TABLE users ALTER COLUMN id TYPE integer USING (id::integer);')

    # Remove colunas adicionadas
    op.drop_column('users', 'created_at')
    op.drop_column('users', 'status')
    op.drop_column('users', 'role')
    op.drop_column('users', 'password_hash')
