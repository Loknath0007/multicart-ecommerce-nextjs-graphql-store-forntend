import { useRouter } from "next/router";
import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { gql, useQuery } from "@apollo/client";
import { Container } from "reactstrap";

const GET_PAGE = gql`
  query getPage($slug: String) {
    getPage(slug: $slug) {
      title
      description
      slug
      createdAt
    }
  }
`;
const AllPageSingle = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);
  var { loading, data, refetch } = useQuery(GET_PAGE, {
    variables: { slug: id },
  });
  console.log("data:"), data;
  return (
    <div>
      <CommonLayout parent="Home" title={data && data.getPage.title}>
        <Container>
          {/* <h2>{data && data.getPage.title}</h2> */}
          <br />
          <div
            dangerouslySetInnerHTML={{
              __html: data && data.getPage.description,
            }}
          >
            {}
          </div>
        </Container>
      </CommonLayout>
    </div>
  );
};

export default AllPageSingle;
