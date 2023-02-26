import { RowDataPacket } from "mysql2";
import { CommonUpdateDTOType } from "../../types";

export interface ICategorySingleDTO extends RowDataPacket {
  id: string;
  name: string;
  subCategories?: ICategorySingleDTO[];
  parentId?: string;
}

export interface ICategoryGroupDTO extends RowDataPacket {
  id: string;
  name: string;
}

export interface ICategoryCreateDTO {
  name: string;
  parentId?: string;
}

export type ICategoryUpdateDTO = CommonUpdateDTOType<ICategoryCreateDTO>;
