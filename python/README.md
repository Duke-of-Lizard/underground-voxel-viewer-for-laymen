# Python scripts for interacting with the NetCDF voxel files

## Check the convention compliance `'Conventions': 'ACDD-1.3, CF-1.8'`

https://nordatanet.github.io/NetCDF_in_Python_from_beginner_to_pro/04_creating_a_cfnetcdf_file.html#metadata-attributes

### Use `compliance-checker`

```bash
uv add compliance-checker
cchecker.py --test=cf:1.8 "/path/to/netcdf_file.nc"
```
