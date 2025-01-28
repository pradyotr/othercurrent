import { Heading, Box, Table } from '@chakra-ui/react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Comments() {
  const { data, error } = useSWR('https://jsonplaceholder.typicode.com/comments', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <>
      <Heading size="lg" mb={4}>Comments</Heading>
      <Box maxH="500px" overflowY="auto">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((comment, index) => (
              <Table.Row key={index}>
                <Table.Cell>{comment.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </>
  );
}

export default Comments;