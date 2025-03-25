describe('Domain Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('admin@example.com', 'password123');
    cy.visit('/domains');
  });

  it('should display domain list', () => {
    cy.get('h1').should('contain', 'Domains');
    cy.get('table').should('exist');
    cy.get('th').should('have.length.at.least', 5);
  });

  it('should add a new domain', () => {
    cy.get('button').contains('Add Domain').click();
    
    // Fill in the form
    cy.get('input[name="name"]').type('test.com');
    cy.get('input[name="registrar"]').type('GoDaddy');
    cy.get('input[name="registrationDate"]').type('2023-01-01');
    cy.get('input[name="expiryDate"]').type('2024-01-01');
    cy.get('select[name="status"]').select('active');
    cy.get('input[name="autoRenew"]').check();
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.chakra-toast').should('contain', 'Domain created successfully');
    
    // Verify domain appears in list
    cy.get('table').should('contain', 'test.com');
  });

  it('should edit an existing domain', () => {
    // Find and click edit button for first domain
    cy.get('button[aria-label="Edit"]').first().click();
    
    // Update domain details
    cy.get('input[name="name"]').clear().type('updated.com');
    cy.get('select[name="status"]').select('expired');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.chakra-toast').should('contain', 'Domain updated successfully');
    
    // Verify changes in list
    cy.get('table').should('contain', 'updated.com');
    cy.get('table').should('contain', 'expired');
  });

  it('should delete a domain', () => {
    // Find and click delete button for first domain
    cy.get('button[aria-label="Delete"]').first().click();
    
    // Confirm deletion
    cy.get('button').contains('Confirm').click();
    
    // Verify success message
    cy.get('.chakra-toast').should('contain', 'Domain deleted successfully');
  });

  it('should filter domains by status', () => {
    // Open filter drawer
    cy.get('button').contains('Filters').click();
    
    // Select status filter
    cy.get('select[name="status"]').select('active');
    
    // Verify filtered results
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(2).should('contain', 'active');
    });
  });

  it('should search domains', () => {
    // Type in search box
    cy.get('input[placeholder="Search domains..."]').type('test');
    
    // Verify search results
    cy.get('table tbody tr').should('have.length.at.least', 1);
    cy.get('table').should('contain', 'test');
  });

  it('should sort domains', () => {
    // Click name column header to sort
    cy.get('th').contains('Name').click();
    
    // Verify sort indicator
    cy.get('th').contains('Name').should('contain', '↑');
  });

  it('should perform bulk operations', () => {
    // Select multiple domains
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input[type="checkbox"]').eq(1).check();
    
    // Verify bulk delete button appears
    cy.get('button').contains('Delete Selected').should('exist');
    
    // Perform bulk delete
    cy.get('button').contains('Delete Selected').click();
    cy.get('button').contains('Confirm').click();
    
    // Verify success message
    cy.get('.chakra-toast').should('contain', 'Domains deleted successfully');
  });

  it('should export domains', () => {
    // Click export button
    cy.get('button').contains('Export').click();
    
    // Verify file download
    cy.readFile('cypress/downloads/domains.xlsx').should('exist');
  });

  it('should handle pagination', () => {
    // Navigate to next page
    cy.get('button').contains('Next').click();
    
    // Verify page number updates
    cy.get('text').should('contain', 'Page 2');
    
    // Navigate to previous page
    cy.get('button').contains('Previous').click();
    
    // Verify page number updates
    cy.get('text').should('contain', 'Page 1');
  });
}); 