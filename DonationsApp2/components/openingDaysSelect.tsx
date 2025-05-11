import Select from "react-select";
import { diasDaSemana } from "@/lib/utils";
import CustomMultiValueLabel from "./customMultiValueLabel";
import makeAnimated from 'react-select/animated';

interface OpeningDaysSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
}
const animatedComponents = makeAnimated();
export default function OpeningDaysSelect({ value, onChange }: OpeningDaysSelectProps) {
  const selectedOptions = diasDaSemana.filter((opt) => value.includes(opt.value));

  return (
    <Select
      placeholder="Dias da semana"
      isMulti
      value={selectedOptions}
      onChange={(selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
        onChange(values);
      }}
      classNames={{
        control: () =>
          ""
      }}
      options={diasDaSemana}
      components={{
        ...animatedComponents,
        MultiValueLabel: CustomMultiValueLabel, // Substitui só o necessário
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          height: 40,
          minHeight: 40,
          cursor: 'pointer',
          borderColor: state.isFocused ? '#16A34A' : base.borderColor, // Aplica a borda verde quando focado
          boxShadow: state.isFocused ? '0 0 0 1px #16A34A' : base.boxShadow, // Remove a borda azul padrão e aplica a verde
          '&:hover': {
            borderColor: state.isFocused ? '#16A34A' : base.borderColor, 
          
          },
          borderRadius: "6px",
        }),
        valueContainer: (base) => ({
          ...base,
          height: 40,
          overflow: "hidden",
          flexWrap: "nowrap",
          cursor: 'pointer', // Aplica o cursor pointer na área dos valores selecionados
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: 40,
          cursor: 'pointer', // Aplica o cursor pointer nos indicadores (setas)
        }),
        multiValue: (base) => ({
          ...base,
          cursor: 'pointer', // Aplica o cursor pointer nas opções selecionadas
        }),
        multiValueLabel: (base) => ({
          ...base,
          cursor: 'pointer', // Aplica o cursor pointer nas labels dos valores
        }),
        multiValueRemove: (base) => ({
          ...base,
          cursor: 'pointer', // Aplica o cursor pointer no botão de remoção dos valores
        }),
        menu: (base) => ({
          ...base,
          cursor: 'pointer', // Aplica o cursor pointer no menu das opções
        }),
        option: (base) => ({
          ...base,
          cursor: 'pointer', // Aplica o cursor pointer nas opções dentro do menu
        }),
      }}
    />
  );
}
