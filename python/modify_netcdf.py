from pathlib import Path

import numpy as np
import pandas as pd
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

    xx, yy, zz = np.meshgrid(xrds["x"], xrds["y"], xrds["z"], indexing="ij")

    xyz_df = pd.DataFrame(
        {
            "x": xx.flatten() - 567214.6875,
            "y": yy.flatten() - 6664015.5,
            "z": zz.flatten(),
            "resistivity": xrds["resistivity"].values.flatten(),
            "probability_sensitive_clay": xrds[
                "probability_sensitive_clay"
            ].values.flatten(),
        }
    )
    xyz_df = xyz_df.dropna(subset=["resistivity"])

    xyz_df.to_csv(Path.cwd().parent / "data" / "FRE16" / "xyz.csv", index=False)

    # print(xrds)
    print(xrds["x"].min().item())
    print(xrds["y"].min().item())
    # print(xrds["y"].attrs)
    # print(xrds["z"].attrs)
    # print(xrds["resistivity"].attrs)
    # print(xrds["probability_sensitive_clay"].attrs)
    # print(xrds["grid_mapping"].attrs)


if __name__ == "__main__":
    main()
