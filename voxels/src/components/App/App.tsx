import { NavLink } from "react-router";

export const App = () => {
  return (
    <>
      <h1>Voxel Data</h1>
      <ul>
        <li>
          <NavLink to="speckle"></NavLink>
        </li>
        <li>
          <NavLink to="cesium"></NavLink>
        </li>
        <li>
          <NavLink to="upload"></NavLink>
        </li>
      </ul>
    </>
  );
};
