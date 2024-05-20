import { useEffect, useState } from "react";

// firebase
import { db } from "../../main";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";

interface Props {
  userId?: string;
  name?: string;
}

interface ReturnProps {
  isLoading: boolean;
  error: string;
  articlesList: DocumentData | null;
}

const useGetArticlesFromFirestore = ({ userId, name }: Props): ReturnProps => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [articlesList, setArticlesList] = useState<DocumentData[] | null>(null);

  const fetchArticlesFromFirebase = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const constraints: QueryConstraint[] = [
        where("isDeleted", "!=", true),
        orderBy("created_at", "desc"),
      ];

      if (userId) {
        constraints.push(where("authorId", "==", userId));
      }

      if (name) {
        constraints.push(where("surfingSpot", "==", name), limit(6));
      }

      const q = query(collection(db, "articles"), ...constraints);
      const querySnapshot = await getDocs(q);
      const articlesArray = querySnapshot.docs.map((doc) => doc.data());
      setArticlesList(articlesArray);
    } catch (error) {
      console.log(error);
      setError("There was an error");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (userId || name) {
      fetchArticlesFromFirebase();
    }
  }, [userId, name]);

  return { isLoading, error, articlesList };
};

export default useGetArticlesFromFirestore;
