// src/lib/firebase/submissionsService.ts
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit, // Renamed to avoid conflict with local 'limit' variables
  startAt,
  startAfter,
  endAt,
  getCountFromServer,
  Timestamp,
  DocumentData,
  QueryConstraint,
  Query,
  CollectionReference,
  DocumentReference,
  WhereFilterOp
} from 'firebase/firestore';
import { db } from './firebaseClient'; // Your initialized Firestore instance

const SUBMISSIONS_COLLECTION = 'contact-submissions';

// Define the Submission type based on Firestore data structure
// (aligns with what was in page.tsx, but using 'id' and Timestamp)
export interface Submission {
  id: string; // Firestore document ID
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Timestamp; // Firestore Timestamp
  status: 'new' | 'read' | 'replied' | 'archived'; // Consistent with page.tsx
  priority?: number; // Optional, but present in page.tsx
  tags?: string[];
  userAgent?: string;
  ipAddress?: string;
  source?: string;
  // Firestore typically doesn't use $createdAt, $updatedAt in the document data itself
  // These are metadata. If needed, they can be handled by server timestamps on write.
  // For simplicity, we'll rely on the 'timestamp' field for creation time.
}

// Helper to convert Firestore doc to Submission
const fromFirestore = (docSnap: DocumentData): Submission => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    timestamp: data.timestamp || Timestamp.now(), // Fallback if timestamp is missing
    status: data.status || 'new',
    priority: data.priority,
    tags: data.tags,
    userAgent: data.userAgent,
    ipAddress: data.ipAddress,
    source: data.source,
  } as Submission;
};

// --- Service Functions ---

/**
 * Get a list of submissions with pagination, filtering, and sorting.
 * @param itemsPerPage Number of items per page.
 * @param pageNumber Current page number (1-indexed).
 * @param filters Optional filters (e.g., { status: 'new', priority: 1 }).
 * @param sortOptions Optional sorting (e.g., { field: 'timestamp', direction: 'desc' }).
 * @param searchQuery Optional search query for name or email.
 * @returns Promise<{ submissions: Submission[], total: number }>
 */
export const getSubmissions = async (
  itemsPerPage: number,
  pageNumber: number = 1,
  filters?: { status?: string; priority?: number },
  sortOptions?: { field: string; direction: 'asc' | 'desc' },
  searchQuery?: string
): Promise<{ submissions: Submission[]; total: number; totalPages: number }> => {
  const submissionsCol = collection(db, SUBMISSIONS_COLLECTION) as CollectionReference<DocumentData>;
  let qConstraints: QueryConstraint[] = [];
  let countConstraints: QueryConstraint[] = [];

  // Filtering
  if (filters?.status) {
    qConstraints.push(where('status', '==', filters.status));
    countConstraints.push(where('status', '==', filters.status));
  }
  if (filters?.priority) {
    qConstraints.push(where('priority', '==', filters.priority));
    countConstraints.push(where('priority', '==', filters.priority));
  }
  
  // Search (simple case-insensitive prefix search on name or email - Firestore is limited here)
  // For more complex search, consider a third-party search service like Algolia.
  if (searchQuery) {
    // Firestore doesn't support OR queries on different fields directly in this manner
    // or case-insensitive search natively. This is a simplified approach.
    // You might need to store a searchable lowercase field or use multiple queries client-side.
    // For now, let's assume we search by name as an example.
    // A more robust solution would involve a dedicated search index.
    // qConstraints.push(where('name', '>=', searchQuery));
    // qConstraints.push(where('name', '<=', searchQuery + ''));
    // countConstraints.push(where('name', '>=', searchQuery));
    // countConstraints.push(where('name', '<=', searchQuery + ''));
    // This part needs careful consideration based on actual search requirements and Firestore capabilities.
    // For now, we'll omit direct search in this generic function to keep it simple,
    // and it can be added specifically in the component if needed with more complex logic.
  }

  // Sorting
  const sortField = sortOptions?.field || 'timestamp'; // Default sort by timestamp
  const sortDir = sortOptions?.direction || 'desc';   // Default descending
  qConstraints.push(orderBy(sortField, sortDir));
  // Count does not need sorting for total, but needs filters.

  // Get total count for pagination
  const totalSnapshot = await getCountFromServer(query(submissionsCol, ...countConstraints));
  const total = totalSnapshot.data().count;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Pagination
  if (pageNumber > 1 && total > 0) {
    // To implement proper pagination, we need a document to startAfter.
    // This requires fetching the last doc of the previous page.
    const prevPageQueryConstraints = [...qConstraints]; // Copy constraints
    prevPageQueryConstraints.push(firestoreLimit((pageNumber - 1) * itemsPerPage));
    const prevPageSnapshot = await getDocs(query(submissionsCol, ...prevPageQueryConstraints));
    if (prevPageSnapshot.docs.length > 0) {
        const lastVisible = prevPageSnapshot.docs[prevPageSnapshot.docs.length -1];
         // Only add startAfter if lastVisible is defined from previous page.
        if(lastVisible && (pageNumber-1)*itemsPerPage < total ){ // ensure not to add startAfter if it's past the total items
             qConstraints.push(startAfter(lastVisible));
        } else if ((pageNumber-1)*itemsPerPage >= total) {
            // If trying to paginate beyond available documents, return empty
            return { submissions: [], total, totalPages };
        }
    } else if ((pageNumber -1) * itemsPerPage > 0) {
         // If no documents on previous page (and it's not the first page), means current page is empty
         return { submissions: [], total, totalPages };
    }
  }
  qConstraints.push(firestoreLimit(itemsPerPage));
  
  const submissionsSnapshot = await getDocs(query(submissionsCol, ...qConstraints));
  const submissionsList = submissionsSnapshot.docs.map(fromFirestore);

  return { submissions: submissionsList, total, totalPages };
};

/**
 * Get a single submission by its ID.
 * @param id The document ID.
 * @returns Promise<Submission | null>
 */
export const getSubmissionById = async (id: string): Promise<Submission | null> => {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, id) as DocumentReference<DocumentData>;
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return fromFirestore(docSnap);
  }
  return null;
};

/**
 * Update a submission.
 * @param id The document ID.
 * @param updates Partial data to update.
 * @returns Promise<void>
 */
export const updateSubmission = async (id: string, updates: Partial<Omit<Submission, 'id' | 'timestamp'>>): Promise<void> => {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
  // Add an updated_at timestamp if you have such a field in your Firestore documents
  // const dataToUpdate = { ...updates, updatedAt: Timestamp.now() };
  await updateDoc(docRef, updates);
};

/**
 * Delete a submission.
 * @param id The document ID.
 * @returns Promise<void>
 */
export const deleteSubmission = async (id: string): Promise<void> => {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Get count of submissions based on criteria (e.g., for stats).
 * @param filters Optional filters (e.g., { status: 'new', dateRangeStart: Timestamp })
 * @returns Promise<number>
 */
export const getSubmissionsCount = async (
    filters?: { status?: string; dateRangeStart?: Timestamp; dateRangeEnd?: Timestamp }
): Promise<number> => {
    const submissionsCol = collection(db, SUBMISSIONS_COLLECTION);
    let qConstraints: QueryConstraint[] = [];

    if (filters?.status) {
        qConstraints.push(where('status', '==', filters.status));
    }
    if (filters?.dateRangeStart) {
        qConstraints.push(where('timestamp', '>=', filters.dateRangeStart));
    }
    if (filters?.dateRangeEnd) {
        qConstraints.push(where('timestamp', '<=', filters.dateRangeEnd));
    }
    
    const snapshot = await getCountFromServer(query(submissionsCol, ...qConstraints));
    return snapshot.data().count;
};

// Example of how to get all submissions (for stats or export, use with caution on large datasets)
export const getAllSubmissions = async (
  sortOptions?: { field: string; direction: 'asc' | 'desc' }
): Promise<Submission[]> => {
  const submissionsCol = collection(db, SUBMISSIONS_COLLECTION);
  let qConstraints: QueryConstraint[] = [];

  const sortField = sortOptions?.field || 'timestamp';
  const sortDir = sortOptions?.direction || 'desc';
  qConstraints.push(orderBy(sortField, sortDir));
  
  // Potentially add a safety limit if not explicitly wanting ALL documents from a very large collection
  // qConstraints.push(firestoreLimit(1000)); // Example safety limit

  const submissionsSnapshot = await getDocs(query(submissionsCol, ...qConstraints));
  return submissionsSnapshot.docs.map(fromFirestore);
};

// Note on searchSubmissions:
// Firestore is not a full-text search engine. For basic "starts with" or exact matches,
// `where` clauses can be used. For more complex search needs (fuzzy search, relevance scoring,
// searching across multiple fields with OR logic), a dedicated search service like Algolia,
// Elasticsearch, or Typesense integrated with Firebase is recommended.
// The `searchSubmissions` function that was in `submissions-dashboard.tsx` using Appwrite's
// search capabilities will need significant rethinking for Firestore.
// A simple approach for the dashboard could be to fetch a broader set of data and filter/search client-side,
// or implement a very basic "name starts with" type of query if that's acceptable.
