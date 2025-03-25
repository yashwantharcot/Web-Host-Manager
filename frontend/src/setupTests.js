import '@testing-library/jest-dom';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  ChakraProvider: ({ children }) => children,
  useToast: () => ({
    toast: jest.fn(),
  }),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
  useColorMode: () => ({
    colorMode: 'light',
    toggleColorMode: jest.fn(),
  }),
  Box: ({ children }) => <div>{children}</div>,
  Container: ({ children }) => <div>{children}</div>,
  Heading: ({ children }) => <h1>{children}</h1>,
  Text: ({ children }) => <p>{children}</p>,
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Input: ({ onChange, value, placeholder }) => (
    <input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  ),
  Select: ({ children, onChange, value }) => (
    <select onChange={onChange} value={value}>
      {children}
    </select>
  ),
  Table: ({ children }) => <table>{children}</table>,
  Thead: ({ children }) => <thead>{children}</thead>,
  Tbody: ({ children }) => <tbody>{children}</tbody>,
  Tr: ({ children }) => <tr>{children}</tr>,
  Th: ({ children }) => <th>{children}</th>,
  Td: ({ children }) => <td>{children}</td>,
  IconButton: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Checkbox: ({ isChecked, onChange }) => (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
    />
  ),
  Drawer: ({ children, isOpen, onClose }) => (
    isOpen ? <div>{children}</div> : null
  ),
  DrawerBody: ({ children }) => <div>{children}</div>,
  DrawerHeader: ({ children }) => <div>{children}</div>,
  DrawerOverlay: ({ children }) => <div>{children}</div>,
  DrawerContent: ({ children }) => <div>{children}</div>,
  DrawerCloseButton: () => <button>Close</button>,
  FormControl: ({ children }) => <div>{children}</div>,
  FormLabel: ({ children }) => <label>{children}</label>,
  FormErrorMessage: ({ children }) => <div>{children}</div>,
  VStack: ({ children }) => <div>{children}</div>,
  HStack: ({ children }) => <div>{children}</div>,
  SimpleGrid: ({ children }) => <div>{children}</div>,
  Badge: ({ children }) => <span>{children}</span>,
  Tooltip: ({ children }) => <div>{children}</div>,
  Menu: ({ children }) => <div>{children}</div>,
  MenuButton: ({ children }) => <button>{children}</button>,
  MenuList: ({ children }) => <div>{children}</div>,
  MenuItem: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Modal: ({ children, isOpen, onClose }) => (
    isOpen ? <div>{children}</div> : null
  ),
  ModalOverlay: ({ children }) => <div>{children}</div>,
  ModalContent: ({ children }) => <div>{children}</div>,
  ModalHeader: ({ children }) => <div>{children}</div>,
  ModalBody: ({ children }) => <div>{children}</div>,
  ModalFooter: ({ children }) => <div>{children}</div>,
  ModalCloseButton: () => <button>Close</button>,
})); 