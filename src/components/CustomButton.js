// Custom Button Component
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Custom Button Component
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline', 'text')
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {Object} props.style - Additional styles
 * @param {Object} props.textStyle - Additional text styles
 * @param {string} props.loadingText - Text to show when loading
 * @returns {JSX.Element}
 */
const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  loadingText = 'Loading...',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
      if (isDisabled) baseStyle.push(styles.primaryButtonDisabled);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
      if (isDisabled) baseStyle.push(styles.secondaryButtonDisabled);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
      if (isDisabled) baseStyle.push(styles.outlineButtonDisabled);
    } else if (variant === 'text') {
      baseStyle.push(styles.textButton);
      if (isDisabled) baseStyle.push(styles.textButtonDisabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryButtonText);
      if (isDisabled) baseStyle.push(styles.primaryButtonTextDisabled);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButtonText);
      if (isDisabled) baseStyle.push(styles.secondaryButtonTextDisabled);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButtonText);
      if (isDisabled) baseStyle.push(styles.outlineButtonTextDisabled);
    } else if (variant === 'text') {
      baseStyle.push(styles.textButtonText);
      if (isDisabled) baseStyle.push(styles.textButtonTextDisabled);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.buttonContent}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : '#007AFF'}
            style={styles.loadingIndicator}
          />
        )}
        <Text style={[getTextStyle(), textStyle]}>
          {loading ? loadingText : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },

  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Primary variant
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  primaryButtonTextDisabled: {
    color: '#FFFFFF',
  },

  // Secondary variant
  secondaryButton: {
    backgroundColor: '#F2F2F7',
  },
  secondaryButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  secondaryButtonTextDisabled: {
    color: '#8E8E93',
  },

  // Outline variant
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  outlineButtonDisabled: {
    borderColor: '#B0B0B0',
  },
  outlineButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  outlineButtonTextDisabled: {
    color: '#B0B0B0',
  },

  // Text variant
  textButton: {
    backgroundColor: 'transparent',
  },
  textButtonDisabled: {
    backgroundColor: 'transparent',
  },
  textButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  textButtonTextDisabled: {
    color: '#B0B0B0',
  },

  buttonText: {
    textAlign: 'center',
  },

  loadingIndicator: {
    marginRight: 8,
  },
});

export default CustomButton; 