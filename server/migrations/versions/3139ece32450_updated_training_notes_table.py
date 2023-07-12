"""updated training notes table

Revision ID: 3139ece32450
Revises: dc33c5797244
Create Date: 2023-07-12 10:28:43.905932

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3139ece32450'
down_revision = 'dc33c5797244'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('training_notes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('note', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('training_notes', schema=None) as batch_op:
        batch_op.drop_column('note')

    # ### end Alembic commands ###