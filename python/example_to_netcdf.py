import xarray as xr

import datetime as dt
import numpy as np

def main():
    xrds = xr.Dataset(
        coords={
            'x': x_vector,
            'y': y_vector,
            'z': z_vector}
    )
    for name, array in new_3d_arrays.items():
        if name == 'proba_1':
            xrds['probability_sensitive_clay'] = (['z', 'y', 'x', ], np.transpose(array, (2, 0, 1)))
        if name == 'res':
            xrds['resistivity'] = (['z', 'y', 'x', ], 10 ** np.transpose(array, (2, 0, 1)))

    xrds['x'].attrs = {'long_name': 'Easting', 'standard_name': 'projection_x_coordinate', 'units': 'm', 'axis': 'X'}
    xrds['y'].attrs = {'long_name': 'Northing', 'standard_name': 'projection_y_coordinate', 'units': 'm', 'axis': 'Y'}
    xrds['z'].attrs = {'long_name': 'Elevation', 'standard_name': 'height_above_geopotential_datum', 'units': 'm',
                    'axis': 'Z'}

    # 'projection_y_coordinate',
    # 'projection_x_coordinate',
    # 'height_above_geopotential_datum',
    xrds['probability_sensitive_clay'].attrs = {'long_name': 'probability of sensitivity clay', 'units': '1',
                                                'coverage_content_type': 'modelResult'}
    xrds['resistivity'].attrs = {
        'long_name': 'electrical resistivity from a smooth SCI inversion of airbone, time-domain EM surveys in 2016',
        'units': 'Ωm', 'coverage_content_type': 'modelResult'}
    dtnow = dt.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    xrds.attrs = {
        'title': 'Craig'' first attempt at making a NetCDF file',
        'creator_email': 'cch@emrld.no',
        'date_created': dtnow,
    }

    xrds = xrds.rio.write_crs("EPSG:31982", inplace=True)

    myencoding = {
        'x': {
            'dtype': 'float32',
            '_FillValue': None # Coordinate variables should not have fill values.
            },
        'y': {
            'dtype': 'float32',
            '_FillValue': None # Coordinate variables should not have fill values.
            },
        'z': {
            'dtype': 'float32',
            '_FillValue': None # Coordinate variables should not have fill values.
            },
        'probability_sensitive_clay': {
            'dtype': 'float32',
            '_FillValue': -9999,
            },
        # 'proba_2': {
        #     'dtype': 'float32',
        #     '_FillValue': -9999,
        #     },
        'resistivity':{
            'dtype': 'float32',
            '_FillValue': -9999,
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
    xrds.to_netcdf(f'2025-02-08-FRE16-sensitive_clay_probability.nc',encoding=myencoding)

if __name__ == "__main__":
    main()
    