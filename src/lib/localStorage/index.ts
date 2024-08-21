export const saveCategoriesOrder = (categories: any) => {
    localStorage.setItem('categoriesOrder', JSON.stringify(categories));
};

export const loadCategoriesOrder = (): any => {
    const savedOrder = localStorage.getItem('categoriesOrder');
    return savedOrder ? JSON.parse(savedOrder) : [];
};
