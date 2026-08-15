import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProduct, listProductBy, searchFilter, createProduct, updateProduct, deleteProduct } from "../api/product";
import { listCategory, createCategory, removeCategory } from "../api/Category";
import { listUserCart, createUserCart, getOrders, saveOrder, saveAddress } from "../api/user";
import { getListAllUsers, changeUserStatus, changeUserRole, getAdminOrders, changeOrderStatus } from "../api/admin";

// Product Queries & Mutations
export const useProducts = (count: number = 20) => {
  return useQuery({
    queryKey: ["products", count],
    queryFn: async () => {
      const res = await listProduct(count);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProductBy = (sort: string, order: "asc" | "desc", limit: number) => {
  return useQuery({
    queryKey: ["products", "by", sort, order, limit],
    queryFn: async () => {
      const res = await listProductBy(sort, order, limit);
      return res.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await listCategory();
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUserCartQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["userCart"],
    queryFn: async () => {
      const res = await listUserCart();
      return res.data;
    },
    enabled,
  });
};

export const useUserOrders = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await getOrders();
      return res.data.orders;
    },
    enabled,
  });
};

export const useAdminOrders = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await getAdminOrders();
      return res.data;
    },
    enabled,
  });
};

export const useAdminUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await getListAllUsers();
      return res.data;
    },
    enabled,
  });
};

// Common Invalidation Mutations Hook
export const useStoreMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: ["products"] });
  const invalidateCategories = () => queryClient.invalidateQueries({ queryKey: ["categories"] });
  const invalidateUserCart = () => queryClient.invalidateQueries({ queryKey: ["userCart"] });
  const invalidateUserOrders = () => queryClient.invalidateQueries({ queryKey: ["userOrders"] });
  const invalidateAdminOrders = () => queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
  const invalidateAdminUsers = () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] });

  return {
    invalidateProducts,
    invalidateCategories,
    invalidateUserCart,
    invalidateUserOrders,
    invalidateAdminOrders,
    invalidateAdminUsers,
  };
};
