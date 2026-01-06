import { DocumentContent, StoredDocument } from "@/types";
import { useCallback, useEffect, useState } from "react";

const dbName = "DocumentDatabase";
const storeName = "Documents";

const useIndexedDB = () => {
  const [db, setDB] = useState<IDBDatabase | null>(null);

  const initDatabse = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        setDB(request.result);
        resolve(request.result);
      };

      request.onerror = () => {
        setDB(null);
        reject("Failed to open IndexedDB");
      };
    });
  }, []);

  const saveDocument = useCallback(
    async (id: string, content: DocumentContent) => {
      if (!db) {
        throw new Error("IndexedDB not initialized");
      }

      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      store.put({ id, content } as StoredDocument);

      transaction.oncomplete = () => {
        console.log(`Document ${id} saved successfully in IndexedDB`);
      };

      transaction.onerror = (event) => {
        console.error("Failed to save document in IndexedDB:", event);
      };
    },
    [db]
  );

  const getDocument = useCallback(
    async (id: string): Promise<DocumentContent | null> => {
      if (!db) {
        throw new Error("IndexedDB not initialized");
      }

      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);

      return new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.content as DocumentContent);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          reject("Failed to retrieve document from IndexedDB");
        };
      });
    },
    [db]
  );

  useEffect(() => {
    initDatabse();
  }, [initDatabse]);

  return {
    saveDocument,
    getDocument,
  };
};

export default useIndexedDB;
