from pathlib import Path

import xarray as xr


def main():
    netcdf_file = (
        Path.cwd().parent
        / "data"
        / "FRE16"
        / "netcdf"
        / "2025-02-08-FRE16-sensitive_clay_probability-subset.nc"
    )
    xrds = xr.open_dataset(netcdf_file)
    xrds["z"].attrs["positive"] = "up"

    print(xrds["x"].attrs)
    print(xrds["y"].attrs)
    print(xrds["z"].attrs)
    print(xrds["resistivity"].attrs)
    print(xrds["probability_sensitive_clay"].attrs)
    print(xrds["grid_mapping"].attrs)


if __name__ == "__main__":
    main()
