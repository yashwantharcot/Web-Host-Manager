import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';

const ResponsiveTable = ({
  columns,
  data,
  onRowClick,
  selectedRows = [],
  onSelectRow,
  sortConfig,
  onSort,
  ...props
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const renderMobileRow = (item) => (
    <Box
      key={item.id}
      p={4}
      mb={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      cursor={onRowClick ? 'pointer' : 'default'}
      onClick={() => onRowClick?.(item)}
      _hover={onRowClick ? { bg: hoverBg } : undefined}
    >
      {columns.map((column) => (
        <Box key={column.key} mb={2}>
          <Box fontWeight="bold" color="gray.500">
            {column.label}
          </Box>
          <Box>{column.render ? column.render(item) : item[column.key]}</Box>
        </Box>
      ))}
    </Box>
  );

  const renderDesktopRow = (item) => (
    <Tr
      key={item.id}
      cursor={onRowClick ? 'pointer' : 'default'}
      onClick={() => onRowClick?.(item)}
      _hover={onRowClick ? { bg: hoverBg } : undefined}
    >
      {columns.map((column) => (
        <Td key={column.key}>
          {column.render ? column.render(item) : item[column.key]}
        </Td>
      ))}
    </Tr>
  );

  if (isMobile) {
    return (
      <Box {...props}>
        {data.map(renderMobileRow)}
      </Box>
    );
  }

  return (
    <Box overflowX="auto" {...props}>
      <Table variant="simple" bg={bgColor} borderWidth="1px" borderColor={borderColor}>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                cursor={onSort ? 'pointer' : 'default'}
                onClick={() => onSort?.(column.key)}
              >
                {column.label}
                {sortConfig?.key === column.key && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map(renderDesktopRow)}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ResponsiveTable; 