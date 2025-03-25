import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import DomainList from '../DomainList';
import { domainService } from '../../../services/domainService';

// Mock the domain service
jest.mock('../../../services/domainService');

const mockDomains = [
  {
    id: 1,
    name: 'example.com',
    registrar: 'GoDaddy',
    status: 'active',
    registrationDate: '2023-01-01',
    expiryDate: '2024-01-01',
    autoRenew: true,
  },
  {
    id: 2,
    name: 'test.com',
    registrar: 'Namecheap',
    status: 'expired',
    registrationDate: '2022-01-01',
    expiryDate: '2023-01-01',
    autoRenew: false,
  },
];

describe('DomainList Component', () => {
  beforeEach(() => {
    domainService.getAll.mockResolvedValue(mockDomains);
    domainService.delete.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithChakra = (component) => {
    return render(<ChakraProvider>{component}</ChakraProvider>);
  };

  test('renders domain list correctly', async () => {
    renderWithChakra(<DomainList />);

    // Check if loading state is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for domains to load
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
      expect(screen.getByText('test.com')).toBeInTheDocument();
    });

    // Check if table headers are present
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Registrar')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('handles domain deletion', async () => {
    renderWithChakra(<DomainList />);

    // Wait for domains to load
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Check if confirmation dialog appears
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    // Check if delete service was called
    await waitFor(() => {
      expect(domainService.delete).toHaveBeenCalledWith(1);
    });
  });

  test('handles search functionality', async () => {
    renderWithChakra(<DomainList />);

    // Wait for domains to load
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // Find and fill search input
    const searchInput = screen.getByPlaceholderText(/search domains/i);
    fireEvent.change(searchInput, { target: { value: 'example' } });

    // Check if filtered results are shown
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.queryByText('test.com')).not.toBeInTheDocument();
  });

  test('handles filter functionality', async () => {
    renderWithChakra(<DomainList />);

    // Wait for domains to load
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // Open filter drawer
    const filterButton = screen.getByText(/filters/i);
    fireEvent.click(filterButton);

    // Select status filter
    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'active' } });

    // Check if filtered results are shown
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.queryByText('test.com')).not.toBeInTheDocument();
  });

  test('handles sorting functionality', async () => {
    renderWithChakra(<DomainList />);

    // Wait for domains to load
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // Click name column header to sort
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    // Check if sort indicators are shown
    expect(screen.getByText('Name ↑')).toBeInTheDocument();
  });

  test('handles bulk selection', async () => {
    renderWithChakra(<DomainList />);

    // Wait for domains to load
    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    // Select all domains
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    // Check if bulk delete button appears
    expect(screen.getByText(/delete selected/i)).toBeInTheDocument();
  });
}); 