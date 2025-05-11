import { components } from 'react-select';

const CustomMultiValueLabel = (props: any) => {
  const { data } = props; // Acesso aos props do select

  return (
    <components.MultiValueLabel {...props}>
      {data.label.charAt(0).toUpperCase()} {/* Exibe apenas a primeira letra maiúscula */}
    </components.MultiValueLabel>
  );
};

export default CustomMultiValueLabel;
