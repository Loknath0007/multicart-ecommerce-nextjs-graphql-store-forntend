import React, { useEffect } from "react";

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import SingleMenus from "./SingleMenus";

const GET_MENUS = gql`
  query getMenus($indexFrom: Int) {
    getMenus(indexFrom: $indexFrom) {
      id
      name
      primary
      createdAt
      menuList
    }
  }
`;

const MainHeaderMenu = () => {
  var { loading, data, refetch } = useQuery(GET_MENUS, {
    variables: { indexFrom: 0 },
  });
  console.log(data?.getMenus);
  var menuData;
  if (data) {
    console.log("object");
    menuData = data?.getMenus?.map((d) => {
      const data = {
        id: d.id,
        name: d.name,
        menuList: JSON.parse(d.menuList),
        primary: d.primary,
        // create_on: d?.createdAt?.split("T")[0],
      };
      return data;
    });
  }
  useEffect(() => {
    refetch();
  }, [data]);
  console.log("menu Loaded:", menuData);
  return (
    <div>
      {data &&
        data.getMenus &&
        menuData.map((d) => (
          <div className="d-inline">
            {d.name === "Main Menu" &&
              d.primary === true &&
              d.menuList.map((m) => (
                <div className=" d-inline m-2  text-2">
                  <SingleMenus menu={m} />
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default MainHeaderMenu;
