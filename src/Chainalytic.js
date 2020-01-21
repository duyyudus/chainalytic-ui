import React, { useEffect, useState } from "react";

const PROVIDER_URL = "http://140.82.11.203:5531"; // prod-node-dev
// const PROVIDER_URL = "http://45.32.109.194:5530"; // dev-node

const TRANSFORMS = [
  "stake_history",
  "stake_top100",
  "recent_stake_wallets",
  "abstention_stake",
  "funded_wallets",
  "passive_stake_wallets"
];

const ALL_API = [
  "last_block_height",
  "get_staking_info_last_block",
  "get_staking_info",
  "latest_unstake_state",
  "latest_stake_top100",
  "recent_stake_wallets",
  "abstention_stake",
  "funded_wallets",
  "passive_stake_wallets"
];

async function callProvider(url = "", api_id = "", api_params = {}) {
  let data = {
    method: "_call",
    params: {
      call_id: "api_call",
      api_id: api_id,
      api_params: api_params
    },
    id: 123,
    jsonrpc: "2.0"
  };
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "text/plain"
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });
  return await response.json();
}

function LatestBlockHeight(props) {
  let [height, setHeight] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      callProvider(PROVIDER_URL, "last_block_height", {
        transform_id: props.transform_id
      })
        .then(data => {
          // console.log("Call `LatestBlockHeight`:", data);
          let height = data["result"]["result"];
          setHeight(height ? height : "N/A");
        })
        .catch(err => {
          console.error("Failed to request `LatestBlockHeight`:", err);
        });
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  });

  return (
    <div>
      {props.transform_id}: {height}
    </div>
  );
}

export default function ChainalyticUI() {
  return TRANSFORMS.map(transform_id => (
    <LatestBlockHeight transform_id={transform_id} />
  ));
}
