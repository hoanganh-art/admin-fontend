//========= Cấu Hình API =========
//--Địa Chỉ Backend server 
const API_BASE_URL = "http://127.0.0.1:6346/api";
//--Danh sách các API endpoints (Đường dẫn API)
const API_ENDPOINTS = {
  products: "/products", //lấy danh sách sản phẩm
  stats: "/products/stats", //lấy thống kê sản phẩm
  filterOptions: "/products/filter-options", //lấy tùy chọn lọc
  brands: "/products/brands", // lấy danh sách thương hiệu
  categories: "/products/categories", // lấy danh sách danh mục
};

// ========== Tạo Lớp API SERVICE ==========

// Lớp ProductAPIService - chứa tất cả phương thức gọi API liên quan đến sản phẩm
class ProductAPIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json", //// Dữ liệu gửi đi là JSON
      Accept: "application/json", // Chấp nhận dữ liệu trả về là JSON
    };
  }
// ========== PHƯƠNG THỨC CƠ BẢN ĐỂ GỌI API ==========
  
  /**
   * Hàm request chung để gọi API
   * @param {string} endpoint - Đường dẫn API (vd: "/products")
   * @param {object} options - Tùy chọn request (method, body, headers)
   * @returns {Promise} - Promise chứa dữ liệu từ API
   */

  async request(endpoint, options = {}) {
    try {

       // Tạo URL đầy đủ bằng cách nối baseUrl và endpoint
      const url = `${this.baseUrl}${endpoint}`;

      console.log("Requesting URL:", url); // Debug: In ra URL được gọi

      // Gửi request tới server bằng fetch API
      const response = await fetch(url, {
        ...options, // Sao chép các tùy chọn từ tham số
        headers: { ...this.headers, ...options.headers }, // Kết hợp headers mặc định và tùy chọn
      });
      
      // Kiểm tra nếu response không thành công (status code không trong khoảng 200-299)
      if (!response.ok) {
        //Ném lỗi với thông tin status code
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Trả về dữ liệu JSON từ response
      const data = await response.json();
      console.log('`✅ API response:`, data); // Log dữ liệu nhận được');
      return data;

    } catch (error) {
      // Bắt lỗi và log ra console
      console.error("API Error:", error);
      //Ném lỗi để xử lý ở nơi gọi hàm
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
