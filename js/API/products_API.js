// ========== CONFIGURATION ==========
const API_BASE_URL = "http://127.0.0.1:6346/api";
const API_ENDPOINTS = {
  products: "/products",
  stats: "/products/stats",
  filterOptions: "/products/filter-options",
  brands: "/products/brands",
  categories: "/products/categories",
};

// ========== API SERVICE ==========
class ProductAPIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: { ...this.headers, ...options.headers },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  //Lấy danh sản phẩm
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.products}?${queryString}`
      : API_ENDPOINTS.products;
    return this.request(endpoint);
  }

  // Lấy sản phẩm theo ID
  async getProductById(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`);
  }

  // Tạo sản phẩm mới
  async createProduct(productData) {
    return this.request(API_ENDPOINTS.products, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // Cập nhật sản phẩm
  async updateProduct(id, productData) { 
    return this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }
  // Xóa sản phẩm
  async deleteProduct(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: "DELETE",
    });
  }

  // Lấy thống kê
  async getStats() {
    return this.request(API_ENDPOINTS.stats);
  }

  // Lấy tùy chọn lọc
  async getFilterOptions() {
    return this.request(API_ENDPOINTS.filterOptions);
  }

  // Lấy danh sách thương hiệu
  async getBrands() {
    return this.request(API_ENDPOINTS.brands);
  }

  // Lấy danh sách danh mục
  async getCategories() {
    return this.request(API_ENDPOINTS.categories);
  }
}

// Tạo instance toàn cục
const productAPI = new ProductAPIService();
