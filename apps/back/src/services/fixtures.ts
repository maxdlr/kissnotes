import LayerRepository from "@/repositories/LayerRepository";
import PropertyRepository from "@/repositories/PropertyRepository";

export const loadFixtures = async () => {
  await LayerRepository.save({
    name: "my solid",
    type: "solid",
  });
  await PropertyRepository.save({
    name: "position",
    group: "transform",
  });
  console.log("Fixtures loaded");
};
