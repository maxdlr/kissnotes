import LayerEntity from "@/entities/LayerEntity";
import LayerRepository from "@/repositories/LayerRepository";

const findAllLayers = async (): Promise<LayerEntity[]> => {
  return LayerRepository.find();
};

export default findAllLayers;
