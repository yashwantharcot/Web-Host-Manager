import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  useBreakpointValue,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';

const ResponsiveForm = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
  ...props
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: field.value,
      onChange: field.onChange,
      isRequired: field.required,
      isInvalid: field.error,
      errorMessage: field.error,
    };

    switch (field.type) {
      case 'select':
        return (
          <Select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return <Textarea {...commonProps} />;
      default:
        return <Input {...commonProps} type={field.type || 'text'} />;
    }
  };

  const renderFormGroup = (field) => (
    <FormControl key={field.name} isRequired={field.required}>
      <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
      {renderField(field)}
    </FormControl>
  );

  return (
    <Box
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      bg={bgColor}
      p={6}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      {...props}
    >
      <VStack spacing={4} align="stretch">
        {fields.map((field) => (
          <Box key={field.name}>
            {isMobile ? (
              renderFormGroup(field)
            ) : (
              <HStack spacing={4} align="start">
                <Box flex={1}>{renderFormGroup(field)}</Box>
                {field.description && (
                  <Box
                    flex={1}
                    color="gray.500"
                    fontSize="sm"
                    mt={8}
                  >
                    {field.description}
                  </Box>
                )}
              </HStack>
            )}
          </Box>
        ))}
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Submitting..."
        >
          {submitLabel}
        </Button>
      </VStack>
    </Box>
  );
};

export default ResponsiveForm; 