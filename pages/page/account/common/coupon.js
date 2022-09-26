import React from "react";
import { Button, FormGroup, Input } from "reactstrap";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_COUPONS = gql`
  query getCoupons($indexFrom: Int) {
    getCoupons(indexFrom: $indexFrom) {
      discountType
      code
    }
  }
`;

const Coupon = ({ matchCpn, setMatchCpn }) => {
  var { loading, data, refetch } = useQuery(GET_COUPONS, {
    variables: { indexFrom: 0 },
  });
  console.log("data", data);

  const [cpn, setCpn] = useState();

  // handle change
  const handleChange = (e) => {
    setCpn(e.target.value);
  };
  console.log("cpn match: ", matchCpn);
  return (
    <div>
      <div className="sub-total">
        <li>
          Apply Coupon
          <span className="count">
            <div class="input-group mb-3">
              <Input
                type="text"
                value={cpn}
                class="form-control"
                placeholder="Enter Coupon"
                aria-describedby="basic-addon2"
                onChange={handleChange}
              />

              <Button
                onClick={() => {
                  if (!cpn == "") {
                    {
                      const match =
                        data.getCoupons &&
                        data.getCoupons.find((cp) => cp.code === cpn);
                      setMatchCpn(match);
                    }
                  }
                  setCpn("");
                }}
                type="button"
                color="warning"
              >
                Apply
              </Button>
            </div>
          </span>
        </li>
      </div>
    </div>
  );
};

export default Coupon;
