import pprint
from pathlib import Path

import xarray as xr
from pyproj import CRS


def main():
    epsg_25832 = CRS(25832)
    proj_cf_crs_dict = epsg_25832.to_cf()

    data_path = Path.cwd().parent / "data" / "FRE16" / "netcdf"
    netcdf_file = (
        data_path
        # / "2025-02-08-FRE16-sensitive_clay_probability-subset.nc"
        / "2025-02-08-FRE16-sensitive_clay_probability.nc"
    )
    xrds = xr.open_dataset(netcdf_file)
    xrds["epsg_25832"].attrs["wkid"] = 25832
    xrds["epsg_25832"].attrs["authority"] = "EPSG"

    # xrds["z"].attrs["positive"] = "up"

    # xrds = xrds.rio.write_crs(
    #     "EPSG:25832", grid_mapping_name="epsg_25832", inplace=True
    # )
    # xrds["resistivity"].attrs["grid_mapping"] = "epsg_25832"
    # xrds["probability_sensitive_clay"].attrs["grid_mapping"] = "epsg_25832"

    # rio_cf_crs_dict = xrds["epsg_25832"].attrs
    # print(xrds)
    # xrds = xrds.reset_coords("epsg_25832", drop=True)
    # xrds["epsg_25832"].attrs = rio_cf_crs_dict

    myencoding = {
        "x": {
            "dtype": "float32",
            "_FillValue": None,  # Coordinate variables should not have fill values.
        },
        "y": {
            "dtype": "float32",
            "_FillValue": None,  # Coordinate variables should not have fill values.
        },
        "z": {
            "dtype": "float32",
            "_FillValue": None,  # Coordinate variables should not have fill values.
        },
        "probability_sensitive_clay": {
            "dtype": "float32",
            "_FillValue": -9999,
        },
        # 'proba_2': {
        #     'dtype': 'float32',
        #     '_FillValue': -9999,
        #     },
        "resistivity": {
            "dtype": "float32",
            "_FillValue": -9999,
        },
        # 'resistivity_dz':{
        #     'dtype': 'float32',
        #     '_FillValue': -9999,
        # },
        # 'resistivity_dz2': {
        #     'dtype': 'float32',
        #     '_FillValue': -9999,
        # },
    }
    xrds.to_netcdf(
        data_path / "2025-02-08-FRE16-sensitive_clay_probability_wkid.nc",
        encoding=myencoding,
    )

    print(xrds)
    pprint.pprint(xrds["epsg_25832"].attrs)
    # print(xrds["x"].min().item())
    # print(xrds["y"].min().item())
    # print(xrds["y"].attrs)
    # print(xrds["z"].attrs)
    print(xrds["resistivity"].attrs)
    # print(xrds["probability_sensitive_clay"].attrs)
    # print(xrds["grid_mapping"].attrs)


if __name__ == "__main__":
    main()
