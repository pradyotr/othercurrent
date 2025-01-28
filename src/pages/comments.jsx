import { VStack, Heading, Button } from '@chakra-ui/react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Comments() {
  const { data, error } = useSWR('https://jsonplaceholder.typicode.com/comments', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <VStack>
      <Heading size="lg">Comments</Heading>
      {data.map((comment) => (
        <Button key={comment.id} variant="outline" colorScheme="blue">
          {comment.name}
        </Button>
      ))}
    </VStack>
  );
}

export default Comments;
