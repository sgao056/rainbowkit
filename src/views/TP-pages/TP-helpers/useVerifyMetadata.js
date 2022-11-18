
import { useState } from "react";
import useIPFS from "./useIPFS";


const useVerifyMetadata = () => {
  const { resolveLink } = useIPFS();
  const [results, setResults] = useState({});

  /**
   * Fet Metadata  from NFT and Cache Results
   * @param {object} NFT
   * @returns NFT
   */

 

  /**
   * Extract Metadata from NFT,
   *  Fallback: Fetch from URI
   * @param {object} NFT
   * @returns void
   */
 

  /**
   * Update NFT Object
   * @param {object} NFT
   * @param {object} metadata
   */
  function setMetadata(NFT, metadata) {
    
    NFT.metadata = metadata;
    
    if (metadata?.image) NFT.image = resolveLink(metadata.image);
    
    if (metadata && !results[NFT.token_uri])
      setResults({ ...results, [NFT.token_uri]: NFT });
  } 
  async function getMetadata(NFT) {
    if (!NFT.token_uri || !NFT.token_uri.includes("://")) {
      // console.log("getMetadata() Invalid URI", { URI: NFT.token_uri, NFT });
      return;
    }
    fetch(NFT.token_uri)
      .then((res) => res.json())
      .then((metadata) => {
        if (!metadata) {
          console.error(
            "useVerifyMetadata.getMetadata() No Metadata found on URI:",
            { URI: NFT.token_uri, NFT },
          );
        }
        else if (
          metadata?.detail &&
          metadata.detail.includes("Request was throttled")
        ) {
          // console.warn(
          //   "useVerifyMetadata.getMetadata() Bad Result for:" +
          //     NFT.token_uri +
          //     "  Will retry later",
          //   { results, metadata },
          // );
          setTimeout(function () {
            getMetadata(NFT);
          }, 1000);
        } 
        else {   
          setMetadata(NFT, metadata);
        } 
      })
      .catch((err) => {
        console.error("useVerifyMetadata.getMetadata() Error Caught:", {
          err,
          NFT,
          URI: NFT.token_uri,
        });
      });
  } 

  function verifyMetadata(NFT) {
    if(NFT){
      if (NFT.metadata) return NFT;
      getMetadata(NFT);
      return results?.[NFT.token_uri] ? results?.[NFT.token_uri] : NFT;
    }
    return null;
  }

  return { verifyMetadata };
}; 

export default useVerifyMetadata