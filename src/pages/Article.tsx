import React from "react";
// import React, { useEffect, useState } from "react";

// firebase
// import { db } from "../main";
// import { doc, getDoc } from "firebase/firestore";
// import { useParams } from "react-router-dom";

const Article: React.FC = () => {
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [article, setArticle] = useState<DocumentData[] | null>(null);

  //   const { id } = useParams();

  //   const fetchArticleFromFirebase = async (): Promise<void> => {
  //     setIsLoading(true);
  //     try {
  //       // const docRef = doc(db, "articles", id);
  //       // const docSnap = await getDoc(docRef);
  //       // setArticle(docSnap.data());
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setIsLoading(false);
  //   };

  //   useEffect(() => {}, []);

  return <div className="mx-auto w-[70%] max-w-5xl"></div>;
};

export default Article;
