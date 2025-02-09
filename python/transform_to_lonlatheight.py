from pathlib import Path

import numpy as np
import pandas as pd
import xarray as xr
from pyproj import Transformer


def main():
    netcdf_file = (
        Path.cwd().parent
        / "data"
        / "FRE16"
        / "netcdf"
        # / "2025-02-08-FRE16-sensitive_clay_probability-subset.nc"
        / "2025-02-08-FRE16-sensitive_clay_probability.nc"
    )
    xrds = xr.open_dataset(netcdf_file)

    xrds["z"].attrs["positive"] = "up"

    xx, yy, zz = np.meshgrid(xrds["x"], xrds["y"], xrds["z"], indexing="ij")

    df = pd.DataFrame(
        {
            "easting": xx.flatten(),
            "northing": yy.flatten(),
            "elevation": zz.flatten(),
            "resistivity": xrds["resistivity"].values.flatten(),
            "probability_sensitive_clay": xrds[
                "probability_sensitive_clay"
            ].values.flatten(),
        }
    )
    df = df.dropna(subset=["resistivity"])

    from_crs = 25832
    transformer = Transformer.from_crs(from_crs, 4326, always_xy=True)
    lon, lat, wgs84_height = transformer.transform(
        df["easting"], df["northing"], df["elevation"]
    )
    df["lon"] = lon
    df["lat"] = lat
    df["wgs84_height"] = wgs84_height

    df[
        ["lon", "lat", "wgs84_height", "resistivity", "probability_sensitive_clay"]
    ].to_csv(Path.cwd().parent / "data" / "FRE16" / "lonlatheight.csv", index=False)


if __name__ == "__main__":
    main()
