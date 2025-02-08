from pathlib import Path

import nctoolkit as nc


def main():
    netcdf_file = Path.cwd().parent / "data" / "2024-12-13-first_test-netcdf.nc"
    ds = nc.open_data(netcdf_file)
    ds.check()


if __name__ == "__main__":
    main()
