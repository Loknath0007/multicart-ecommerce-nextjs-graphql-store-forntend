import Link from "next/link";
import React from "react";

const SingleMenus = ({ menu }) => {
  console.log("menu", menu);
  return (
    <Link className="m-2 d-inline" href={`/AllPage/${menu.slug}`}>
      <a className="d-inline text-dark my-2">{menu.name}</a>
    </Link>
  );
};

export default SingleMenus;
