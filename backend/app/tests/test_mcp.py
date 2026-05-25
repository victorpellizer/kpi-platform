import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import the tool functions directly, not the mcp object
from api.mcp import get_kpi_estimates, get_qtd_estimates, list_companies


async def test_list_companies():
    """Test the list_companies tool"""
    result = await list_companies()
    print("✓ list_companies:", result[:3])  # Show first 3
    assert isinstance(result, list)
    assert len(result) > 0


async def test_get_kpi_estimates():
    """Test the get_kpi_estimates tool"""
    result = await get_kpi_estimates(company_name="Acme E-commerce")
    print("✓ get_kpi_estimates:", len(result), "rows")
    assert isinstance(result, list)


async def test_get_qtd_estimates():
    """Test the get_qtd_estimates tool"""
    result = await get_qtd_estimates(company_name="Acme E-commerce", as_of="2026-01-01")
    print("✓ get_qtd_estimates:", result)
    assert isinstance(result, dict)
    assert "company_name" in result
    assert "rows" in result


async def main():
    print("Testing MCP Tools...\n")
    try:
        await test_list_companies()
        await test_get_kpi_estimates()
        await test_get_qtd_estimates()
        print("\n✓ All tests passed!")
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
