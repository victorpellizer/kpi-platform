import uuid
from datetime import datetime
from pathlib import Path

import pandas as pd
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "create_kpi_data_table"
down_revision = None
branch_labels = None
depends_on = None


def _parse_timestamp(value):
    if value is None:
        return None
    if isinstance(value, str):
        value = value.strip()
        if value == "":
            return None
        return datetime.fromisoformat(value)
    if pd.isna(value):
        return None
    if isinstance(value, pd.Timestamp):
        return value.to_pydatetime()
    return value


def upgrade():
    op.create_table(
        "kpi_data",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_name", sa.String(length=100), nullable=True),
        sa.Column("ticker", sa.String(length=10), nullable=True),
        sa.Column("sector", sa.String(length=50), nullable=True),
        sa.Column("kpi", sa.String(length=50), nullable=True),
        sa.Column("period_start", sa.TIMESTAMP(), nullable=True),
        sa.Column("period_end", sa.TIMESTAMP(), nullable=True),
        sa.Column("period", sa.String(length=10), nullable=True),
        sa.Column("estimate_type", sa.String(length=100), nullable=True),
        sa.Column("value", sa.Numeric(), nullable=True),
        sa.Column("unit", sa.String(length=10), nullable=True),
        sa.Column("as_of", sa.TIMESTAMP(), nullable=True),
    )

    connection = op.get_bind()
    metadata = sa.MetaData()

    kpi_table = sa.Table(
        "kpi_data",
        metadata,
        sa.Column("id", postgresql.UUID(as_uuid=True)),
        sa.Column("company_name", sa.String(100)),
        sa.Column("ticker", sa.String(10)),
        sa.Column("sector", sa.String(50)),
        sa.Column("kpi", sa.String(50)),
        sa.Column("period_start", sa.TIMESTAMP()),
        sa.Column("period_end", sa.TIMESTAMP()),
        sa.Column("period", sa.String(10)),
        sa.Column("estimate_type", sa.String(100)),
        sa.Column("value", sa.Numeric()),
        sa.Column("unit", sa.String(10)),
        sa.Column("as_of", sa.TIMESTAMP()),
    )

    csv_path = Path("app/data/kpi_sample_2000.csv")

    df = pd.read_csv(csv_path)

    # Conversão de datas
    df["period_start"] = pd.to_datetime(df["period_start"], errors="coerce")
    df["period_end"] = pd.to_datetime(df["period_end"], errors="coerce")
    df["as_of"] = pd.to_datetime(df["as_of"], errors="coerce")

    records = []

    for _, row in df.iterrows():
        records.append(
            {
                "id": uuid.uuid4(),
                "company_name": row.get("company_name"),
                "ticker": row.get("ticker"),
                "sector": row.get("sector"),
                "kpi": row.get("kpi"),
                "period_start": _parse_timestamp(row.get("period_start")),
                "period_end": _parse_timestamp(row.get("period_end")),
                "period": row.get("period"),
                "estimate_type": row.get("estimate_type"),
                "value": row.get("value"),
                "unit": row.get("unit"),
                "as_of": _parse_timestamp(row.get("as_of")),
            }
        )

    op.bulk_insert(kpi_table, records)


def downgrade():
    op.drop_table("kpi_data")
