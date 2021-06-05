import { TranslateCompiler } from '@ngx-translate/core';

export class Category
{
    id: number;
    publicId: string;
    categoryUri: string;
    isActive: boolean;
    categoryName: string;
    categoryDescription: string;
    createdAt: Date;
    updatedAt: Date;
    categoryPhotoKey: string;
    translations: Translation[];
}

export class Translation {
    language_code: string;
    translated_title: string;
    category_id: string;
}